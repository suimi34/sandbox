require 'rails_helper'

RSpec.describe Resolvers::DogsResolver do
  subject { SandboxSchema.execute(query, context: {}, variables: variables).to_h }

  describe 'DogsResolver' do
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

    let(:variables) { {} }

    context 'when no dogs' do
      it 'returns empty array' do
        res = subject
        expect(res.dig('data', 'dogs', 'nodes')).to be_empty
      end
    end

    context 'when dogs exist' do
      let!(:dog) { create(:dog) }

      it 'returns dogs' do
        res = subject
        response_dog = res.dig('data', 'dogs', 'nodes').first
        expect(response_dog['id']).to eq(dog.id.to_s)
      end
    end
  end
end
