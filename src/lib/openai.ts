import OpenAI from 'openai';
import { ChatContext, ChatMessage, OpenAIRequest, OpenAIResponse } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: false, // Only allow on server-side
});

const DEFAULT_SYSTEM_PROMPT = `You are a compassionate stress reduction assistant specializing in evidence-based techniques for managing stress, anxiety, and depression.

Your role is to:
- Provide practical, actionable advice for stress management
- Use evidence-based techniques like mindfulness, cognitive behavioral therapy, and relaxation exercises
- Maintain a warm, supportive, and professional tone
- Consider the user's assessment history to personalize recommendations
- Always prioritize user safety and suggest professional help when appropriate
- Be encouraging while acknowledging that progress takes time

When responding:
- Keep responses concise but comprehensive (150-300 words)
- Include specific techniques or exercises when relevant
- Use encouraging language without being overly cheerful
- Suggest professional help if user expresses severe symptoms or suicidal thoughts
- Reference their stress levels to provide contextually appropriate advice

Remember: You are a supportive guide, not a replacement for professional mental healthcare.`;

export class ChatAssistant {
  static async generateResponse(
    userMessage: string,
    context?: Partial<ChatContext>
  ): Promise<{ response: string; tokensUsed: number }> {
    try {
      // Build context-aware system prompt
      const systemPrompt = this.buildContextualSystemPrompt(context);

      // Build messages array
      const messages = [
        { role: 'system' as const, content: systemPrompt },
        // Include recent chat history for context
        ...(context?.session_history?.slice(-6) || []).map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        { role: 'user' as const, content: userMessage }
      ];

      const request: OpenAIRequest = {
        model: 'gpt-4-turbo-preview',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      };

      const response = await openai.chat.completions.create(request);
      const assistantMessage = response.choices[0]?.message?.content ||
        'I apologize, but I\'m having trouble responding right now. Please try again.';

      return {
        response: assistantMessage,
        tokensUsed: response.usage?.total_tokens || 0,
      };
    } catch (error) {
      console.error('OpenAI API error:', error);

      // Return a fallback response
      return {
        response: this.getFallbackResponse(userMessage, context),
        tokensUsed: 0,
      };
    }
  }

  private static buildContextualSystemPrompt(context?: Partial<ChatContext>): string {
    let contextualPrompt = DEFAULT_SYSTEM_PROMPT;

    if (context?.user_assessment) {
      const { stress_level, anxiety_level, depression_level } = context.user_assessment;

      contextualPrompt += `\n\nUser's Current Assessment Results:\n`;
      contextualPrompt += `- Stress Level: ${stress_level}\n`;
      contextualPrompt += `- Anxiety Level: ${anxiety_level}\n`;
      contextualPrompt += `- Depression Level: ${depression_level}\n`;

      // Adjust tone based on stress levels
      if (stress_level === 'severe' || stress_level === 'extremely_severe') {
        contextualPrompt += `\n\nThe user is currently experiencing high stress. Be extra gentle, encouraging, and focus on immediate coping strategies.`;
      } else if (stress_level === 'normal' || stress_level === 'mild') {
        contextualPrompt += `\n\nThe user is managing stress well. Focus on prevention strategies and building resilience.`;
      }
    }

    if (context?.previous_topics && context.previous_topics.length > 0) {
      contextualPrompt += `\n\nPreviously discussed topics: ${context.previous_topics.join(', ')}. Build upon these conversations when relevant.`;
    }

    if (context?.user_preferences?.tone) {
      const toneGuidance = {
        supportive: 'Use extra encouraging and warm language.',
        professional: 'Maintain a more formal, clinical tone while remaining compassionate.',
        casual: 'Use a more relaxed, conversational style while maintaining professionalism.',
        empathetic: 'Focus heavily on emotional validation and understanding.'
      };

      contextualPrompt += `\n\nTone guidance: ${toneGuidance[context.user_preferences.tone]}`;
    }

    return contextualPrompt;
  }

  private static getFallbackResponse(userMessage: string, context?: Partial<ChatContext>): string {
    // Generic stress management responses when API is unavailable
    const message = userMessage.toLowerCase();

    if (message.includes('anxious') || message.includes('anxiety')) {
      return "When you're feeling anxious, try this simple breathing exercise: inhale for 4 counts, hold for 4, exhale for 4, and hold for 4. Repeat several times. This 4-4-4-4 technique can help calm your nervous system. Would you like to learn more breathing exercises?";
    }

    if (message.includes('stress') || message.includes('overwhelm')) {
      return "When stress feels overwhelming, it helps to break things down into smaller, manageable steps. Try identifying just one small thing you can control right now, and focus on that. Remember to be gentle with yourself - stress is a normal part of life. What's one area that feels most challenging right now?";
    }

    if (message.includes('sleep') || message.includes('tired')) {
      return "Poor sleep can significantly impact stress levels. Try establishing a relaxing bedtime routine: limit screens an hour before bed, practice some gentle stretching, and ensure your bedroom is cool and dark. What specific aspect of sleep would you like to work on?";
    }

    return "I'm here to support you on your stress management journey. While I'm experiencing some technical difficulties, remember that simple techniques like deep breathing, taking a short walk, or talking with a friend can provide immediate relief. What's on your mind today?";
  }

  static generateSuggestions(userMessage: string, context?: Partial<ChatContext>): string[] {
    const message = userMessage.toLowerCase();
    const suggestions: string[] = [];

    if (message.includes('anxious') || message.includes('anxiety')) {
      suggestions.push(
        "Tell me more about what triggers your anxiety",
        "What breathing techniques have you tried?",
        "How does anxiety affect your daily life?"
      );
    } else if (message.includes('stress') || message.includes('overwhelm')) {
      suggestions.push(
        "What are your main stressors right now?",
        "How do you typically handle stress?",
        "What time of day is most stressful for you?"
      );
    } else if (message.includes('sleep') || message.includes('tired')) {
      suggestions.push(
        "What's your current sleep routine like?",
        "Do you have trouble falling or staying asleep?",
        "How does poor sleep affect your mood?"
      );
    } else {
      suggestions.push(
        "How has your day been going?",
        "What stress management techniques have worked for you?",
        "Is there a specific situation you'd like to discuss?"
      );
    }

    // Add contextual suggestions based on assessment
    if (context?.user_assessment?.stress_level === 'severe' || context?.user_assessment?.stress_level === 'extremely_severe') {
      suggestions.push("Would you like to talk about professional support options?");
    }

    return suggestions;
  }

  static validateMessage(message: string): { isValid: boolean; error?: string } {
    if (!message || message.trim().length === 0) {
      return { isValid: false, error: 'Message cannot be empty' };
    }

    if (message.length > 2000) {
      return { isValid: false, error: 'Message is too long (max 2000 characters)' };
    }

    // Check for potentially harmful content (basic check)
    const harmfulPatterns = [
      /suicide/i,
      /kill myself/i,
      /end my life/i,
      /self-harm/i,
    ];

    if (harmfulPatterns.some(pattern => pattern.test(message))) {
      return {
        isValid: false,
        error: 'If you\'re having thoughts of self-harm, please reach out to a crisis hotline immediately. Call 988 in the US or your local emergency services.'
      };
    }

    return { isValid: true };
  }
}

// Export OpenAI instance for advanced usage
export { openai };

// Rate limiting helper
export class RateLimiter {
  private static requests = new Map<string, { count: number; resetTime: number }>();

  static checkLimit(userId: string, maxRequests = 20, windowMs = 60000): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(userId);

    if (!userRequests || now > userRequests.resetTime) {
      // Reset or initialize counter
      this.requests.set(userId, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (userRequests.count >= maxRequests) {
      return false; // Rate limit exceeded
    }

    userRequests.count++;
    return true;
  }

  static getRemainingRequests(userId: string, maxRequests = 20): number {
    const userRequests = this.requests.get(userId);
    if (!userRequests || Date.now() > userRequests.resetTime) {
      return maxRequests;
    }
    return Math.max(0, maxRequests - userRequests.count);
  }
}