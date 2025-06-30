module Resolvers
  class CatsResolver < Resolvers::Base
    type Types::CatType.connection_type, null: false

    def resolve
      Cat.all
    end
  end
end
