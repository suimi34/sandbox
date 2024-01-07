class CreateOpenAiMessages < ActiveRecord::Migration[7.0]
  def change
    create_table :open_ai_messages do |t|
      t.text :content, null: false
      t.string :thread_id, null: false
      t.string :run_id, null: true
      t.text :response, null: true

      t.timestamps
    end
  end
end
