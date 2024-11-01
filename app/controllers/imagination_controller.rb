require 'net/http'
require 'json'

class ImaginationController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    # Render the HTML view
  end

  def create_ai_powered_image
    prompt = params[:prompt]

    # Setup for OpenAI's DALL-E API endpoint
    uri = URI("https://api.openai.com/v1/images/generations")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri)
    request["Authorization"] = "Bearer #{ENV['OPEN_AI_KEY']}"
    request["Content-Type"] = "application/json"
    request.body = {
      model: "dall-e-3",
      prompt: prompt,
      n: 1, # Request one image
      size: "1024x1024" # Image size
    }.to_json

    # Make the request and parse response
    response = http.request(request)
    response_data = JSON.parse(response.body)

    # Error logging
    if response.code != "200" || !response_data["data"]
      Rails.logger.error "OpenAI API error: #{response_data}"
      render json: { error: "OpenAI API error: #{response_data}" }, status: :bad_request
      return
    end

    # Get image URL from response
    image_url = response_data["data"][0]["url"] if response_data["data"]&.any?

    # Return image URL or an error message if missing
    if image_url
      render json: { image_url: image_url }
    else
      render json: { error: "Image Not Generated" }, status: :unprocessable_entity
    end
  end
end
