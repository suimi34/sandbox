require 'rails_helper'

RSpec.describe 'Dogs' do
  describe 'idnex' do
    let!(:dog) { create(:dog) }

    it 'returns 200' do
      get dogs_path
      expect(response).to have_http_status(:ok)
    end
  end
end
