require 'rails_helper'

RSpec.describe Cat do
  describe 'validations' do
    it 'validates presence of name' do
      cat = described_class.new(breed: 'Persian', age: 3, color: 'White')
      expect(cat).not_to be_valid
      expect(cat.errors[:name]).to include("can't be blank")
    end

    it 'validates presence of breed' do
      cat = described_class.new(name: 'Fluffy', age: 3, color: 'White')
      expect(cat).not_to be_valid
      expect(cat.errors[:breed]).to include("can't be blank")
    end

    it 'validates presence of age' do
      cat = described_class.new(name: 'Fluffy', breed: 'Persian', color: 'White')
      expect(cat).not_to be_valid
      expect(cat.errors[:age]).to include("can't be blank")
    end

    it 'validates presence of color' do
      cat = described_class.new(name: 'Fluffy', breed: 'Persian', age: 3)
      expect(cat).not_to be_valid
      expect(cat.errors[:color]).to include("can't be blank")
    end

    it 'validates age is greater than 0' do
      cat = described_class.new(name: 'Fluffy', breed: 'Persian', age: 0, color: 'White')
      expect(cat).not_to be_valid
      expect(cat.errors[:age]).to include('must be greater than 0')
    end

    it 'validates age is less than 30' do
      cat = described_class.new(name: 'Fluffy', breed: 'Persian', age: 30, color: 'White')
      expect(cat).not_to be_valid
      expect(cat.errors[:age]).to include('must be less than 30')
    end

    it 'is valid with all required attributes' do
      cat = described_class.new(name: 'Fluffy', breed: 'Persian', age: 3, color: 'White')
      expect(cat).to be_valid
    end
  end

  describe 'scopes' do
    let!(:persian_cat) { create(:cat, breed: 'Persian', age: 5, color: 'White') }
    let!(:siamese_cat) { create(:cat, breed: 'Siamese', age: 3, color: 'Brown') }
    let!(:young_cat) { create(:cat, breed: 'Maine Coon', age: 2, color: 'Black') }

    describe '.by_breed' do
      it 'returns cats of specific breed' do
        expect(described_class.by_breed('Persian')).to include(persian_cat)
        expect(described_class.by_breed('Persian')).not_to include(siamese_cat)
      end
    end

    describe '.by_age_range' do
      it 'returns cats within age range' do
        cats_in_range = described_class.by_age_range(2, 4)
        expect(cats_in_range).to include(siamese_cat, young_cat)
        expect(cats_in_range).not_to include(persian_cat)
      end
    end

    describe '.by_color' do
      it 'returns cats of specific color' do
        expect(described_class.by_color('White')).to include(persian_cat)
        expect(described_class.by_color('White')).not_to include(siamese_cat)
      end
    end
  end
end
