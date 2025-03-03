use lambda_runtime::{service_fn, Error, LambdaEvent};
use serde::{Deserialize, Serialize};
use tracing::info;

/// Request type for the Lambda function
#[derive(Deserialize)]
struct Request {
    name: Option<String>,
}

/// Response type for the Lambda function
#[derive(Serialize)]
struct Response {
    message: String,
    request_id: String,
}

/// Main Lambda handler function
async fn function_handler(event: LambdaEvent<Request>) -> Result<Response, Error> {
    // Extract the request and context from the event
    let (request, context) = event.into_parts();
    let request_id = context.request_id;
    
    // Log some information about the request
    info!(
        "Processing request with request_id {}",
        request_id
    );

    // Process the request and generate a greeting message
    let name = request.name.unwrap_or_else(|| "World".to_string());
    let message = format!("Hello, {}! This is a Rust AWS Lambda function.", name);
    
    // Return the response
    Ok(Response {
        message,
        request_id,
    })
}

/// Entry point for the Lambda function
#[tokio::main]
async fn main() -> Result<(), Error> {
    // Initialize the tracing subscriber
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .with_ansi(false) // AWS Lambda doesn't support ANSI colors
        .without_time()   // CloudWatch adds timestamps
        .init();
    
    // Start the Lambda runtime and register the handler
    lambda_runtime::run(service_fn(function_handler)).await?;
    
    Ok(())
}
