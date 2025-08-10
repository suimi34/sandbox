module Types
  class CatType < Types::BaseObject
    field :age, Integer, null: false
    field :breed, String, null: false
    field :color, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :id, ID, null: false
    field :name, String, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
