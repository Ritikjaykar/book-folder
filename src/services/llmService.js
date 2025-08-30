// src/services/llmService.js
import { InferenceClient } from '@huggingface/inference';

class EnhancedLLMService {
  constructor() {
    this.client = new InferenceClient({
      apiKey: import.meta.env.VITE_LLM_API_KEY || ''
    });
    
    // Multiple model fallbacks - these are more likely to have available providers
    this.models = [
      'microsoft/DialoGPT-medium',
      'facebook/blenderbot-400M-distill',
      'google/flan-t5-small',
      'distilgpt2'
    ];
    
    this.spellingCorrections = new Map([
      ['harry poter', 'Harry Potter'],
      ['lord of the ring', 'Lord of the Rings'],
      ['game of throne', 'Game of Thrones'],
      ['hobit', 'Hobbit'],
      ['tolkein', 'Tolkien'],
      ['stephen king', 'Stephen King'],
      ['agatha cristie', 'Agatha Christie'],
      ['shakespear', 'Shakespeare']
    ]);

    console.log('🆓 Enhanced LLM Service initialized');
  }

  async enhanceSearchQuery(userQuery, searchType = 'title') {
    console.log('🤖 Enhanced LLM enhancing query:', { userQuery, searchType });

    // First, try AI enhancement with multiple models
    try {
      const aiResult = await this.tryMultipleModels(userQuery, searchType);
      if (aiResult) {
        return { ...aiResult, source: 'ai' };
      }
    } catch (error) {
      console.log('All AI models failed, using smart fallback');
    }

    // Fallback to smart rule-based enhancement
    return this.getSmartEnhancement(userQuery, searchType);
  }

  async tryMultipleModels(userQuery, searchType) {
    for (const model of this.models) {
      try {
        console.log(`Trying model: ${model}`);
        const result = await this.tryModelWithTimeout(model, userQuery, searchType, 5000);
        if (result) {
          console.log(`✅ Success with model: ${model}`);
          return result;
        }
      } catch (error) {
        console.log(`❌ Model ${model} failed: ${error.message}`);
        continue;
      }
    }
    return null;
  }

  async tryModelWithTimeout(model, userQuery, searchType, timeout = 5000) {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeout)
    );

    const modelPromise = this.callModel(model, userQuery, searchType);
    
    try {
      return await Promise.race([modelPromise, timeoutPromise]);
    } catch (error) {
      throw error;
    }
  }

  async callModel(model, userQuery, searchType) {
    let prompt;
    
    // Customize prompt based on model type
    if (model.includes('flan-t5')) {
      prompt = `Suggest better book search terms for: ${userQuery}`;
    } else if (model.includes('blenderbot')) {
      prompt = `Help me search for books. I'm looking for: ${userQuery}. What are some better search terms?`;
    } else {
      prompt = `Book search: "${userQuery}" -> Better terms:`;
    }

    const response = await this.client.textGeneration({
      model: model,
      inputs: prompt,
      parameters: { 
        max_new_tokens: 30, 
        temperature: 0.7, 
        return_full_text: false,
        do_sample: true
      }
    });

    const generatedText = response?.generated_text || response?.[0]?.generated_text || '';
    
    if (!generatedText || generatedText.length < 3) {
      return null;
    }

    return this.parseAIResponse(generatedText, userQuery);
  }

  parseAIResponse(aiText, originalQuery) {
    // Clean up the AI response
    let cleaned = aiText
      .replace(/^\s*[-•*]\s*/, '')
      .replace(/\n+/g, ' ')
      .trim();

    // Extract suggestions
    const suggestions = cleaned
      .split(/[,;]/)
      .map(s => s.trim())
      .filter(s => s && s.length > 2 && s.length < 50)
      .slice(0, 3);

    const enhancedQuery = suggestions[0] || this.smartEnhanceQuery(originalQuery);

    return {
      enhanced_query: enhancedQuery,
      suggestions: suggestions.slice(1),
      corrections: this.getSpellingCorrection(originalQuery),
      search_tips: this.getSearchTip(originalQuery)
    };
  }

  getSmartEnhancement(query, searchType) {
    const correction = this.getSpellingCorrection(query);
    const enhanced = this.smartEnhanceQuery(query);
    const suggestions = this.generateSmartSuggestions(query, searchType);

    return {
      enhanced_query: correction || enhanced,
      suggestions: suggestions,
      corrections: correction,
      search_tips: this.getSearchTip(query),
      source: correction ? 'spelling-correction' : 'smart-rules'
    };
  }

  getSpellingCorrection(query) {
    const lowerQuery = query.toLowerCase();
    
    // Check exact matches
    if (this.spellingCorrections.has(lowerQuery)) {
      return this.spellingCorrections.get(lowerQuery);
    }

    // Check partial matches
    for (const [wrong, correct] of this.spellingCorrections) {
      if (lowerQuery.includes(wrong)) {
        return correct;
      }
    }

    return null;
  }

  smartEnhanceQuery(query) {
    // Basic query enhancement rules
    let enhanced = query.trim();

    // Add common book-related terms if too generic
    const genericTerms = ['book', 'novel', 'story', 'series'];
    if (enhanced.length < 4 && !genericTerms.some(term => enhanced.toLowerCase().includes(term))) {
      enhanced = `${enhanced} book`;
    }

    // Capitalize proper nouns (basic heuristic)
    enhanced = enhanced.replace(/\b\w+/g, (word) => {
      if (word.length > 3) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word;
    });

    return enhanced;
  }

  generateSmartSuggestions(query, searchType) {
    const suggestions = [];
    const lowerQuery = query.toLowerCase();

    // Genre-based suggestions
    if (lowerQuery.includes('fantasy')) {
      suggestions.push('Lord of the Rings', 'Game of Thrones', 'Harry Potter');
    } else if (lowerQuery.includes('mystery')) {
      suggestions.push('Agatha Christie', 'Sherlock Holmes', 'Gone Girl');
    } else if (lowerQuery.includes('sci-fi') || lowerQuery.includes('science fiction')) {
      suggestions.push('Dune', 'Foundation', 'Ender\'s Game');
    }

    // Author name suggestions
    if (lowerQuery.includes('stephen')) {
      suggestions.push('Stephen King', 'Stephen Hawking');
    } else if (lowerQuery.includes('george')) {
      suggestions.push('George R.R. Martin', 'George Orwell');
    }

    // If we found specific suggestions, return them
    if (suggestions.length > 0) {
      return suggestions.slice(0, 3);
    }

    // Generic helpful suggestions based on query type
    if (searchType === 'title') {
      return [
        `"${query}" series`,
        `${query} complete`,
        `${query} collection`
      ];
    } else if (searchType === 'author') {
      return [
        `${query} books`,
        `${query} novels`,
        `${query} bibliography`
      ];
    }

    return [];
  }

  getSearchTip(query) {
    if (query.length < 3) {
      return "Try typing at least 3 characters for better suggestions";
    }
    
    if (query.split(' ').length === 1) {
      return "Try adding the author name or genre for more specific results";
    }
    
    const tips = [
      "Use quotes for exact phrases",
      "Try the author's full name",
      "Include the series name if searching for sequels",
      "Check spelling of character or place names"
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
  }
}

export const llmService = new EnhancedLLMService();