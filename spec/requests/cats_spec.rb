require 'rails_helper'

RSpec.describe 'Cats' do
  describe 'GET /cats' do
    let!(:cat) { create(:cat) }

    it 'returns 200' do
      get cats_path
      expect(response).to have_http_status(:ok)
    end

    it 'displays cat information' do
      get cats_path
      expect(response.body).to include(cat.name)
      expect(response.body).to include(cat.breed)
    end
  end

  describe 'GET /cats/:id' do
    let!(:cat) { create(:cat) }

    it 'returns 200' do
      get cat_path(cat)
      expect(response).to have_http_status(:ok)
    end

    it 'displays cat details' do
      get cat_path(cat)
      expect(response.body).to include(cat.name)
      expect(response.body).to include(cat.breed)
      expect(response.body).to include(cat.age.to_s)
      expect(response.body).to include(cat.color)
    end
  end

  describe 'GET /cats/new' do
    it 'returns 200' do
      get new_cat_path
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'POST /cats' do
    let(:valid_attributes) do
      {
        name: 'Fluffy',
        breed: 'Persian',
        age: 3,
        color: 'White'
      }
    end

    let(:invalid_attributes) do
      {
        name: '',
        breed: '',
        age: nil,
        color: ''
      }
    end

    context 'with valid parameters' do
      it 'creates a new Cat' do
        expect do
          post cats_path, params: { cat: valid_attributes }
        end.to change(Cat, :count).by(1)
      end

      it 'redirects to the created cat' do
        post cats_path, params: { cat: valid_attributes }
        expect(response).to redirect_to(Cat.last)
      end
    end

    context 'with invalid parameters' do
      it 'does not create a new Cat' do
        expect do
          post cats_path, params: { cat: invalid_attributes }
        end.not_to change(Cat, :count)
      end

      it 'renders the new template' do
        post cats_path, params: { cat: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end

  describe 'GET /cats/:id/edit' do
    let!(:cat) { create(:cat) }

    it 'returns 200' do
      get edit_cat_path(cat)
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'PATCH /cats/:id' do
    let!(:cat) { create(:cat) }
    let(:new_attributes) do
      {
        name: 'Updated Name',
        breed: 'Updated Breed'
      }
    end

    context 'with valid parameters' do
      it 'updates the requested cat' do
        patch cat_path(cat), params: { cat: new_attributes }
        cat.reload
        expect(cat.name).to eq('Updated Name')
        expect(cat.breed).to eq('Updated Breed')
      end

      it 'redirects to the cat' do
        patch cat_path(cat), params: { cat: new_attributes }
        expect(response).to redirect_to(cat)
      end
    end

    context 'with invalid parameters' do
      it 'renders the edit template' do
        patch cat_path(cat), params: { cat: { name: '' } }
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end

  describe 'DELETE /cats/:id' do
    let!(:cat) { create(:cat) }

    it 'destroys the requested cat' do
      expect do
        delete cat_path(cat)
      end.to change(Cat, :count).by(-1)
    end

    it 'redirects to the cats list' do
      delete cat_path(cat)
      expect(response).to redirect_to(cats_path)
    end
  end
end
