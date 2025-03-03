# CDK Lambda Rust

This project demonstrates how to deploy Rust-based AWS Lambda functions using AWS CDK (Cloud Development Kit) with TypeScript. It showcases a high-performance serverless solution leveraging Rust's speed and safety.

## Prerequisites

- Node.js (version 16.x or later)
- AWS CLI configured with appropriate credentials
- AWS CDK CLI (`pnpm install -g aws-cdk`)
- Docker installed and running (for building the Rust Lambda)

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/andrewlohc/cdk-lambda-rust.git
   cd cdk-lambda-rust
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

## Usage

1. Deploy the stack:
   ```
   npx cdk deploy
   ```
   This command will automatically build the Rust function inside a Docker container and deploy the CDK stack.

2. Test the deployed Lambda function:
   ```
   aws lambda invoke \
     --function-name $(aws cloudformation describe-stacks --stack-name CdkLamdbdaRustStack --query "Stacks[0].Outputs[?OutputKey=='RustLambdaName'].OutputValue" --output text) \
     --payload '{"name":"YourName"}' \
     response.json
   
   cat response.json
   ```

3. Clean up resources when finished:
   ```
   cdk destroy
   ```

## Project Structure

- `lib/` - Contains the CDK infrastructure code
- `bin/` - CDK application entry point
- `lambda/` - Rust Lambda function code
  - `src/main.rs` - Lambda handler implementation
  - `Cargo.toml` - Rust dependencies and configuration

## How It Works

This project uses AWS CDK to build and deploy the Rust Lambda function:

1. CDK uses a `rust:1.75-slim` Docker image to provide a consistent build environment
2. Inside the container, it:
   - Adds the `aarch64-unknown-linux-gnu` target for cross-compilation
   - Installs the gcc cross-compiler
   - Builds an optimized ARM64 binary with Rust's release profile
   - Packages the binary for AWS Lambda's custom runtime

Key benefits:
- **No local Rust toolchain required**: Everything builds in the container
- **Consistent builds**: Same environment regardless of local setup
- **Performance**: Rust provides excellent cold start times and runtime performance
- **Cost efficiency**: ARM64 architecture reduces cost and improves performance
- **Safety**: Rust's memory safety helps prevent common serverless security issues

## Modifying the Lambda Function

To modify the Lambda function:
1. Edit the Rust code in `lambda/src/main.rs` or update dependencies in `lambda/Cargo.toml`
2. Deploy with `cdk deploy` which will automatically rebuild the function inside a Docker container
3. No separate build step is required as CDK handles the build process

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
