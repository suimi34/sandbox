class CreateDogSupporters < ActiveRecord::Migration[7.2]
  def change
    create_table :dog_supporters do |t|
      t.bigint :dog_id, null: false, unsigned: true
      t.references :supporter, null: false, foreign_key: true
      t.timestamps
    end

    add_foreign_key :dog_supporters, :dogs, column: :dog_id, name: 'index_dog_supporters_on_dog_id'
  end
end
