class Dog < ApplicationRecord
  has_many :dog_supporters
  has_many :supporters, through: :dog_supporters

  validates :name, presence: true
end
