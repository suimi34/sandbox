class OpenAiMessagesController < ApplicationController
  before_action :set_open_ai_message, only: %i[ show edit update destroy ]

  # GET /open_ai_messages or /open_ai_messages.json
  def index
    open_ai_messages = OpenAiMessage.all
    client = OpenAI::Client.new(access_token: ENV.fetch("OPEN_AI_ACCESS_TOKEN"))

    open_ai_messages.reject { _1.response.present? }.each do |message|
      conversations = client.messages.list(thread_id: message.thread_id)
      res = conversations['data'].first { _1['role'] == 'assistant' }
      response = res['content'][0]['text']['value']
      message.response = response
      message.save!
    end

    @open_ai_messages = OpenAiMessage.all.order(created_at: :desc)
  end

  # GET /open_ai_messages/1 or /open_ai_messages/1.json
  def show

  end

  # GET /open_ai_messages/new
  def new
    @open_ai_message = OpenAiMessage.new
  end

  # GET /open_ai_messages/1/edit
  def edit
  end

  # POST /open_ai_messages or /open_ai_messages.json
  def create
    @open_ai_message = OpenAiMessage.new(open_ai_message_params)


    # 非同期化
    post_open_ai
    # Retrieve/poll Run to observe status
    # response = client.runs.retrieve(id: run_id, thread_id: thread_id)
    # pp response
    # status = response['status']

    respond_to do |format|
      if @open_ai_message.save
        format.html { redirect_to open_ai_message_url(@open_ai_message), notice: "Open ai message was successfully created." }
        format.json { render :show, status: :created, location: @open_ai_message }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @open_ai_message.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /open_ai_messages/1 or /open_ai_messages/1.json
  def update
    respond_to do |format|
      if @open_ai_message.update(open_ai_message_params)
        format.html { redirect_to open_ai_message_url(@open_ai_message), notice: "Open ai message was successfully updated." }
        format.json { render :show, status: :ok, location: @open_ai_message }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @open_ai_message.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /open_ai_messages/1 or /open_ai_messages/1.json
  def destroy
    @open_ai_message.destroy

    respond_to do |format|
      format.html { redirect_to open_ai_messages_url, notice: "Open ai message was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_open_ai_message
      @open_ai_message = OpenAiMessage.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def open_ai_message_params
      params.fetch(:open_ai_message).permit(:content)
    end

    def post_open_ai
      client = OpenAI::Client.new(access_token: ENV.fetch("OPEN_AI_ACCESS_TOKEN"))
      assistant_id = ENV.fetch("OPEN_AI_ASSISTANT_ID")

      response = client.threads.create
      thread_id = response["id"]
      @open_ai_message.thread_id = thread_id

      message_id = client.messages.create(
      thread_id: thread_id,
        parameters: {
          role: "user", # Required for manually created messages
          content: "「#{@open_ai_message.content}」をお題にショートストーリーを作成してください"
        }
      )["id"]

      # Create run (will use instruction/model/tools from Assistant's definition)
      response = client.runs.create(thread_id: thread_id,
        parameters: {
          assistant_id: assistant_id
        }
      )
      run_id = response['id']
      @open_ai_message.run_id = run_id
    end
end
