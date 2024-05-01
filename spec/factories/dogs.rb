FactoryBot.define do
  factory :dog do
    name { Faker::Creature::Dog.name }
  end
end
