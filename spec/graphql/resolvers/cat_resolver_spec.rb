require 'rails_helper'

RSpec.describe Resolvers::CatResolver do
  subject { SandboxSchema.execute(query, context: {}, variables: variables).to_h }

  describe 'CatResolver' do
    let(:query) do
      <<~GQL
        query($id: ID!) {
          cat(id: $id) {
            id
            name
            breed
            age
            color
            createdAt
            updatedAt
          }
        }
      GQL
    end

    let!(:cat) { create(:cat, name: 'Fluffy', breed: 'Persian', age: 3, color: 'White') }
    let(:variables) { { id: cat.id.to_s } }

    context "when cat exists" do
      it "returns the cat with all fields" do
        res = subject
        response_cat = res.dig('data', 'cat')

        expect(response_cat['id']).to eq(cat.id.to_s)
        expect(response_cat['name']).to eq('Fluffy')
        expect(response_cat['breed']).to eq('Persian')
        expect(response_cat['age']).to eq(3)
        expect(response_cat['color']).to eq('White')
        expect(response_cat['createdAt']).to be_present
        expect(response_cat['updatedAt']).to be_present
      end
    end

    context "when cat does not exist" do
      let(:variables) { { id: '99999' } }

      it "returns an error" do
        res = subject
        expect(res['errors']).to be_present
        expect(res['errors'].first['message']).to include("Cat with ID 99999 not found")
      end
    end

    context "when invalid ID is provided" do
      let(:variables) { { id: 'invalid' } }

      it "returns an error" do
        res = subject
        expect(res['errors']).to be_present
        expect(res['errors'].first['message']).to include("Cat with ID invalid not found")
      end
    end
  end
end
