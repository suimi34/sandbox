require 'rails_helper'

RSpec.describe OpenAiMessagesController, type: :request do
  describe '#idnex' do
    it 'returns 200' do
      get open_ai_messages_path
      expect(response).to have_http_status(200)
    end
  end

  describe '#create' do
    let!(:mock_service) { instance_double(OpenAi::ShortStoryService, create!: nil) }
    let!(:mocking) do
      allow(OpenAi::ShortStoryService).to receive(:new).and_return(mock_service)
    end

    it 'calls OpenAi::ShortStoryService once' do
      post open_ai_messages_path, params: { open_ai_message: { content: 'sample' } }
      expect(mock_service).to have_received(:create!).once
    end

    it 'calls ReflectShortStoryJob' do
      post open_ai_messages_path, params: { open_ai_message: { content: 'sample' } }
      expect(ReflectShortStoryJob).to have_been_enqueued
    end

    it 'redirects to open_ai_messages_path' do
      post open_ai_messages_path, params: { open_ai_message: { content: 'sample' } }
      expect(response).to redirect_to(open_ai_messages_path)
    end
  end
end
