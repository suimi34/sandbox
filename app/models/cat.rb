class Cat < ApplicationRecord
  validates :name, presence: true, length: { minimum: 1, maximum: 50 }
  validates :breed, presence: true, length: { maximum: 50 }
  validates :age, presence: true, numericality: { greater_than: 0, less_than: 30 }
  validates :color, presence: true, length: { maximum: 30 }

  scope :by_breed, ->(breed) { where(breed: breed) }
  scope :by_age_range, ->(min_age, max_age) { where(age: min_age..max_age) }
  scope :by_color, ->(color) { where(color: color) }
end
