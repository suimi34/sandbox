module Resolvers
  class CatResolver < Resolvers::Base
    argument :id, ID, required: true

    type Types::CatType, null: false

    def resolve(id:)
      Cat.find(id)
    rescue ActiveRecord::RecordNotFound
      raise GraphQL::ExecutionError, "Cat with ID #{id} not found"
    end
  end
end
