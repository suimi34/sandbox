module Resolvers
  class DogsResolver < Resolvers::Base
    type Types::DogType.connection_type, null: false

    def resolve
      Dog.all
    end
  end
end
