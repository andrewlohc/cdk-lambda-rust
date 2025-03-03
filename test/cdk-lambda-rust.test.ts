import { describe, it, expect } from 'vitest';
import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { CdkLamdbdaRustStack } from '../lib/cdk-lambda-rust-stack';

describe('CdkLamdbdaRustStack', () => {
  it('creates a Rust Lambda function with correct configuration', () => {
    const app = new cdk.App();
    const stack = new CdkLamdbdaRustStack(app, 'MyTestStack');
    const template = Template.fromStack(stack);

    // Verify Lambda function resource exists
    template.resourceCountIs('AWS::Lambda::Function', 1);
    
    // Verify Lambda function has correct properties
    template.hasResourceProperties('AWS::Lambda::Function', {
      Runtime: 'provided.al2023',
      Handler: 'bootstrap',
      Architectures: ['arm64'],
      Timeout: 30,
      MemorySize: 128,
      Environment: {
        Variables: {
          RUST_BACKTRACE: '1'
        }
      }
    });
    
    // Verify outputs exist
    template.hasOutput('RustLambdaName', {
      Description: 'The name of the Rust Lambda function'
    });
    
    template.hasOutput('RustLambdaArn', {
      Description: 'The ARN of the Rust Lambda function'
    });
  });
});
