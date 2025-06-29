class ReflectShortStoryJob < ApplicationJob
  queue_as :default

  POLLING_INTERVAL = 1.second
  MAX_POLLING_TIME = 5.minutes
  POLLING_STATUSES = %w[queued in_progress cancelling].freeze
  TERMINAL_STATUSES = %w[completed requires_action cancelled failed expired].freeze

  def perform(thread_id, run_id)
    start_time = Time.current

    loop do
      check_timeout!(start_time)

      run = fetch_run_status(thread_id, run_id)
      status = run['status']

      Rails.logger.info("OpenAI run #{run_id} status: #{status}")

      break if handle_run_status(status, run, thread_id, run_id)

      sleep POLLING_INTERVAL
    end
  rescue => e
    Rails.logger.error("ReflectShortStoryJob failed: #{e.message}")
    Rails.logger.error(e.backtrace.join("\n"))
    raise
  end

  private

  def check_timeout!(start_time)
    if Time.current - start_time > MAX_POLLING_TIME
      raise StandardError, "OpenAI run polling timed out after #{MAX_POLLING_TIME} seconds"
    end
  end

  def fetch_run_status(thread_id, run_id)
    client.runs.retrieve(id: run_id, thread_id: thread_id)
  rescue => e
    Rails.logger.error("Failed to fetch run status: #{e.message}")
    raise
  end

  def handle_run_status(status, run, thread_id, run_id)
    case status
    when *POLLING_STATUSES
      Rails.logger.debug("Polling OpenAI run #{run_id}, status: #{status}")
      false # Continue polling
    when 'completed'
      handle_completed_run(thread_id, run_id)
      true # Stop polling
    when 'requires_action'
      Rails.logger.warn("OpenAI run #{run_id} requires action - stopping polling")
      true # Stop polling
    when 'cancelled', 'failed', 'expired'
      handle_failed_run(run, run_id)
      true # Stop polling
    else
      Rails.logger.error("Unknown OpenAI run status: #{status}")
      raise StandardError, "Unknown status response: #{status}"
    end
  end

  def handle_completed_run(thread_id, run_id)
    message = find_message(thread_id, run_id)
    response_content = extract_assistant_response(thread_id)

    message.update!(response: response_content)
    Rails.logger.info("Successfully updated message #{message.id} with OpenAI response")
  end

  def handle_failed_run(run, run_id)
    error_details = run['last_error']
    Rails.logger.error("OpenAI run #{run_id} failed: #{error_details.inspect}")

    # Optionally update the message with error status
    # message = find_message(thread_id, run_id)
    # message.update!(status: 'failed', error: error_details)
  end

  def find_message(thread_id, run_id)
    message = OpenAiMessage.find_by(run_id: run_id, thread_id: thread_id)
    raise StandardError, "Message not found for run_id: #{run_id}, thread_id: #{thread_id}" unless message
    message
  end

  def extract_assistant_response(thread_id)
    conversations = client.messages.list(thread_id: thread_id)
    assistant_message = conversations['data'].find { |msg| msg['role'] == 'assistant' }

    unless assistant_message
      raise StandardError, "No assistant response found for thread_id: #{thread_id}"
    end

    assistant_message['content'][0]['text']['value']
  rescue => e
    Rails.logger.error("Failed to extract assistant response: #{e.message}")
    raise
  end

  def client
    @client ||= OpenAI::Client.new(access_token: ENV.fetch("OPEN_AI_ACCESS_TOKEN"))
  end
end
