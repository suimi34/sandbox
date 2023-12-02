module Resolvers
  class DogResolver < Resolvers::Base
    argument :id, ID, required: true

    type Types::DogType, null: false

    def resolve(id:)
      Dog.find(id)
    end
  end
end
