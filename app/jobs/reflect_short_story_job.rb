class ReflectShortStoryJob < ApplicationJob
  queue_as :default

  def perform(thread_id, run_id)
    while true do
      run = client.runs.retrieve(id: run_id, thread_id:)
      status = run['status']

      case status
      when 'queued', 'in_progress', 'cancelling'
        puts 'Sleeping'
        sleep 1 # Wait one second and poll again
      when 'completed'
        message = OpenAiMessage.find_by(run_id: run_id, thread_id: thread_id)
        conversations = client.messages.list(thread_id: message.thread_id)
        res = conversations['data'].first { _1['role'] == 'assistant' }
        response = res['content'][0]['text']['value']
        message.response = response
        message.save!

        break # Exit loop and report result to user
      when 'requires_action'
        break
        # Handle tool calls (see below)
      when 'cancelled', 'failed', 'expired'
        puts run['last_error'].inspect
        break # or `exit`
      else
        puts "Unknown status response: #{status}"
      end
    end
  end

  private

  def client
    OpenAI::Client.new(access_token: ENV.fetch("OPEN_AI_ACCESS_TOKEN"))
  end
end
