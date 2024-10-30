Rails.application.routes.draw do
  root "imagination#index"
  post "imagination/create_ai_powered_image", to: "imagination#create_ai_powered_image"
end