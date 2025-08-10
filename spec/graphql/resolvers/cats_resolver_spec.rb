require 'rails_helper'

RSpec.describe Resolvers::CatsResolver do
  subject { SandboxSchema.execute(query, context: {}, variables: variables).to_h }

  describe 'CatsResolver' do
    let(:query) do
      <<~GQL
        query {
          cats(first: 10) {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      GQL
    end

    let(:variables) { {} }

    context 'when no cats' do
      it 'returns empty array' do
        res = subject
        expect(res.dig('data', 'cats', 'edges')).to be_empty
      end
    end

    context 'when cats exist' do
      let!(:cat) { create(:cat, name: 'Fluffy', breed: 'Persian', age: 3, color: 'White') }

      it 'returns cats' do
        res = subject
        response_cat = res.dig('data', 'cats', 'edges').first['node']

        expect(response_cat['id']).to eq(cat.id.to_s)
      end
    end

    context 'when multiple cats exist' do
      let!(:cat1) { create(:cat, name: 'Fluffy', breed: 'Persian') }
      let!(:cat2) { create(:cat, name: 'Whiskers', breed: 'Siamese') }

      it 'returns all cats' do
        res = subject
        cats = res.dig('data', 'cats', 'edges')

        expect(cats.length).to eq(2)
        cat_names = cats.map { |edge| edge['node']['name'] }
        expect(cat_names).to contain_exactly('Fluffy', 'Whiskers')
      end
    end
  end
end
