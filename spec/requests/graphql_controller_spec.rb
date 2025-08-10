require 'rails_helper'

RSpec.describe 'GraphqlController' do
  describe 'execute' do
    let(:query) do
      <<~GQL
        query {
          dogs {
            nodes {
              id
              name
            }
          }
        }
      GQL
    end

    it 'returns 200' do
      post graphql_path, params: { query: query }
      expect(response).to have_http_status(:ok)
    end
  end
end
