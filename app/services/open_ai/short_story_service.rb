module OpenAi
  class ShortStoryService
    attr_reader :open_ai_message

    def initialize(open_ai_message)
      @open_ai_message = open_ai_message
    end

    def create!
      response = client.threads.create
      thread_id = response["id"]

      client.messages.create(thread_id: thread_id,
        parameters: {
          role: "user", # Required for manually created messages
          content: "「#{open_ai_message.content}」をお題にショートストーリーを作成してください"
        }
      )

      # Create run (will use instruction/model/tools from Assistant's definition)
      response = client.runs.create(thread_id: thread_id,
        parameters: {
          assistant_id: ENV.fetch("OPEN_AI_ASSISTANT_ID")
        }
      )
      run_id = response["id"]

      open_ai_message.thread_id = thread_id
      open_ai_message.run_id = run_id
      open_ai_message.save!
    end

    private
      def client
        return @client if defined?(@client)

        @client = OpenAI::Client.new(access_token: ENV.fetch("OPEN_AI_ACCESS_TOKEN"))
      end
  end
end
