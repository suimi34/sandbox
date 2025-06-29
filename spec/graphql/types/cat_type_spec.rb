require 'rails_helper'

RSpec.describe Types::CatType do
  let(:cat) { create(:cat, name: 'Fluffy', breed: 'Persian', age: 3, color: 'White') }
  let(:context) { {} }
  let(:variables) { {} }

  # Test field definitions
  it 'has the expected fields' do
    expected_fields = %w[id name breed age color createdAt updatedAt]
    expect(described_class.fields.keys).to match_array(expected_fields)
  end

  # Test field types
  describe 'field types' do
    it 'has correct field types' do
      expect(described_class.fields['id'].type).to eq(GraphQL::Types::ID.to_non_null_type)
      expect(described_class.fields['name'].type).to eq(GraphQL::Types::String.to_non_null_type)
      expect(described_class.fields['breed'].type).to eq(GraphQL::Types::String.to_non_null_type)
      expect(described_class.fields['age'].type).to eq(GraphQL::Types::Int.to_non_null_type)
      expect(described_class.fields['color'].type).to eq(GraphQL::Types::String.to_non_null_type)
      expect(described_class.fields['createdAt'].type).to eq(GraphQL::Types::ISO8601DateTime.to_non_null_type)
      expect(described_class.fields['updatedAt'].type).to eq(GraphQL::Types::ISO8601DateTime.to_non_null_type)
    end
  end

  # Test that fields return correct values
  describe 'field resolution' do
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

    it 'resolves all fields correctly' do
      result = SandboxSchema.execute(query, variables: { id: cat.id.to_s }, context: context)
      cat_data = result.dig('data', 'cat')

      expect(cat_data['id']).to eq(cat.id.to_s)
      expect(cat_data['name']).to eq('Fluffy')
      expect(cat_data['breed']).to eq('Persian')
      expect(cat_data['age']).to eq(3)
      expect(cat_data['color']).to eq('White')
      expect(cat_data['createdAt']).to eq(cat.created_at.iso8601)
      expect(cat_data['updatedAt']).to eq(cat.updated_at.iso8601)
    end
  end

  # Test inheritance
  it 'inherits from BaseObject' do
    expect(described_class.superclass).to eq(Types::BaseObject)
  end
end