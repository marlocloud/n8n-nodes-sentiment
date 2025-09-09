# n8n-nodes-marlo-sentiment

This is an n8n community node that integrates with the [Marlo Sentiment Analysis API](https://marlo.cloud) via RapidAPI to perform AI-powered sentiment analysis on text content.

![n8n.io - Workflow Automation](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)

## Prerequisites

You need the following installed on your development machine:

* [git](https://git-scm.com/downloads)
* Node.js and npm. Minimum version Node 20. You can find instructions on how to install both [here](https://nodejs.org/en/download/).
* Install n8n with:
	```bash
	npm install n8n -g
	```

## Installation

### Community Nodes (Recommended)

For users on n8n v0.187+, your instance owner can install this node from **Settings** > **Community Nodes**.

The installation identifier is:
```
n8n-nodes-marlo-sentiment
```

### Manual Installation

To install the node locally, you can use n8n's community node installation feature:

```bash
cd ~/.n8n && npm install n8n-nodes-marlo-sentiment
```

For Docker users, add the following line before the font installation command in your n8n Dockerfile:
```dockerfile
RUN cd /usr/local/lib/node_modules/n8n && npm install n8n-nodes-marlo-sentiment
```

Restart n8n and you should see the **Marlo Sentiment** node available in the nodes panel.

## Configuration

### Credentials

Before using this node, you need to configure your RapidAPI credentials:

1. **Get RapidAPI Access**: Visit the [Marlo Sentiment API on RapidAPI](https://rapidapi.com/marlo-cloud-marlo-cloud-default/api/sentimental-industry-specific-sentiment-analysis)
2. **Subscribe**: Subscribe to the API plan that fits your needs
3. **Get API Key**: Copy your RapidAPI key from the dashboard
4. **Configure in n8n**:
   - In n8n, create new credentials for "Marlo Sentiment API"
   - Enter your RapidAPI key
   - The RapidAPI Host should be: `marlo-sentiment.p.rapidapi.com`

## Operations

### Analyze Sentiment

Analyzes the sentiment of text content and returns:

- **Sentiment**: Overall sentiment classification (positive, negative, neutral)
- **Confidence**: Confidence score for the sentiment classification (0-1)
- **Text Length**: Character count of the analyzed text
- **Industry Context** (optional): Industry-specific sentiment analysis
- **Raw Scores** (optional): Detailed sentiment scores (positive, negative, neutral, compound)

### Supported Industries

The node supports industry-specific sentiment analysis for:

- Healthcare
- Technology  
- Gaming
- Finance
- Restaurant
- Automotive
- Real Estate
- Fitness
- Education
- Retail

## Usage Examples

### Basic Sentiment Analysis

1. Add the **Marlo Sentiment** node to your workflow
2. Configure your credentials
3. Set the **Text** parameter to the content you want to analyze
4. The node will return sentiment analysis results

### Industry-Specific Analysis

1. Configure the node as above
2. Set the **Industry** parameter to match your content context
3. This provides more accurate sentiment analysis for industry-specific language

### Batch Processing

The node can process multiple items in a workflow, making it perfect for:
- Analyzing customer feedback from surveys
- Processing social media mentions
- Evaluating product reviews
- Monitoring support ticket sentiment

## Node Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Text | String | Yes | The text content to analyze for sentiment |
| Industry | Options | No | Industry context for more accurate analysis |
| Include Raw Scores | Boolean | No | Whether to include detailed sentiment scores in output |

## Output

The node outputs a JSON object with the following structure:

```json
{
  "sentiment": "positive",
  "confidence": 0.85,
  "text_length": 150,
  "original_text": "Your analyzed text...",
  "industry": "technology",
  "scores": {
    "positive": 0.8,
    "negative": 0.1,
    "neutral": 0.1,
    "compound": 0.75
  }
}
```

## Error Handling

The node includes comprehensive error handling:
- **Empty text**: Returns an error if no text is provided
- **API errors**: Handles RapidAPI rate limits and authentication errors
- **Network issues**: Gracefully handles connection problems
- **Continue on fail**: Option to continue workflow execution even if sentiment analysis fails

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Marlo Sentiment API Documentation](https://rapidapi.com/marlo-cloud-marlo-cloud-default/api/sentimental-industry-specific-sentiment-analysis)
* [Marlo Cloud Official Website](https://marlo.cloud)

## Version History

### 1.0.0
- Initial release
- Basic sentiment analysis functionality
- Industry-specific analysis support
- RapidAPI integration
- Comprehensive error handling

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)