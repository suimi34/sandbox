class DogSupportersController < ApplicationController
  def index
    @dog_supporters = DogSupporter.all.includes(:dog, :supporter)
  end

  def show
    @dog_supporter = DogSupporter.find(params[:id])
  end

  def new
    @dog_supporter = DogSupporter.new
    @dogs = Dog.all
    @supporters = Supporter.all
  end

  def create
    @dog_supporter = DogSupporter.new(dog_supporter_params)
    if @dog_supporter.save
      redirect_to @dog_supporter, notice: 'Dog supporter was successfully created.'
    else
      @dogs = Dog.all
      @supporters = Supporter.all
      render :new, status: :unprocessable_entity
    end
  end

  private

  def dog_supporter_params
    params.require(:dog_supporter).permit(:dog_id, :supporter_id)
  end
end
