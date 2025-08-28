# This file should ensure the existence of records required to run the app in production using `bin/rails db:seed`.
# Faker gem is already installed since it's in the Gemfile in the development and test groups.

# Create 10 Supporters
10.times do
  Supporter.create!(
    email: Faker::Internet.email(domain: 'example.test')
  )
end
