class CreateDogs < ActiveRecord::Migration[7.0]
  def change
    create_table :dogs, unsigned: true do |t|
      t.string :name, null: false

      t.timestamps
    end
  end
end
