class ReflectShortStoryJob < ApplicationJob
  queue_as :default

  def perform(thread_id, run_id)
    run = client.runs.retrieve(id: run_id, thread_id:)

    pp 'run'
    pp run

    if run['status'] === "queued" || run['status'] === "in_progress"

    end

    if run['status'] === "requires_action" && run['required_action']
      pp 'requires_action'
      pp run['required_action']
      # call = run.required_action.submit_tool_outputs.tool_calls[0]
    end

  end

  def client
    OpenAI::Client.new(access_token: ENV.fetch("OPEN_AI_ACCESS_TOKEN"))
  end
end
