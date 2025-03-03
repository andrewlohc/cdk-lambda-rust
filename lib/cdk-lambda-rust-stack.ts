import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as path from 'path';

const __dirname = import.meta.dirname;  

export class CdkLamdbdaRustStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a Lambda function from the Rust binary
    const rustLambda = new lambda.Function(this, 'RustLambdaFunction', {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: 'bootstrap', // This is required for custom runtimes but not used
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda'), {
        bundling: {
          image: cdk.DockerImage.fromRegistry('rust:1.75-slim'),
          command: [
            'bash', '-c', [
              'rustup target add aarch64-unknown-linux-gnu',
              'apt-get update && apt-get install -y gcc-aarch64-linux-gnu',
              'cargo build --release --target aarch64-unknown-linux-gnu',
              'cp target/aarch64-unknown-linux-gnu/release/bootstrap /asset-output/',
            ].join(' && ')
          ],
          user: 'root',
        },
      }),
      architecture: lambda.Architecture.ARM_64, // Using ARM for better performance/cost
      timeout: cdk.Duration.seconds(30),
      memorySize: 128,
      environment: {
        RUST_BACKTRACE: '1', // Enable backtraces for debugging
      },
    });

    // Output the Lambda function name
    new cdk.CfnOutput(this, 'RustLambdaName', {
      value: rustLambda.functionName,
      description: 'The name of the Rust Lambda function',
    });

    // Output the Lambda function ARN
    new cdk.CfnOutput(this, 'RustLambdaArn', {
      value: rustLambda.functionArn,
      description: 'The ARN of the Rust Lambda function',
    });
  }
}
