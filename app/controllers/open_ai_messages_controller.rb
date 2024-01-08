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

    OpenAi::ShortStoryService.new(@open_ai_message).create!
    ReflectShortStoryJob.perform_later(@open_ai_message.thread_id, @open_ai_message.run_id)

    redirect_to open_ai_message_url(@open_ai_message), notice: "Open ai message was successfully created."
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
end
