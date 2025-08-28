class Supporter < ApplicationRecord
  has_many :dog_supporters
  has_many :dogs, through: :dog_supporters
end
