FactoryBot.define do
  factory :cat do
    name { Faker::Creature::Cat.name }
    breed { Faker::Creature::Cat.breed }
    age { Faker::Number.between(from: 1, to: 20) }
    color { %w[Black White Gray Orange Brown Calico Tabby].sample }
  end
end
