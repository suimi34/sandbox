FactoryBot.define do
  factory :supporter do
    email { Faker::Internet.email(domain: 'example.test') }
  end
end
