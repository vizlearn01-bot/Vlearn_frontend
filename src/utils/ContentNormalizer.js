// src/utils/ContentNormalizer.js

export const ContentNormalizer = {
    // 1. Core text extractor and parser
    extractText(content) {
        if (!content) return '';
        if (typeof content === 'string') {
            try { 
                const p = JSON.parse(content); 
                return p.text || p.content || p.procedure || content; 
            } catch { 
                return content; 
            }
        }
        if (typeof content === 'object') {
            return content.text || content.content || content.procedure || '';
        }
        return String(content);
    },

    parseContent(content) {
        if (!content) return {};
        if (typeof content === 'object') return content;
        if (typeof content === 'string') {
            try { return JSON.parse(content); }
            catch { return { text: content }; }
        }
        return {};
    },

    // 2. Comprehensive text sanitization
    sanitizeText(rawText) {
        if (!rawText) return '';
        let text = rawText;

        // Remove wrapping quotes if they encapsulate the entire string incorrectly
        if (text.startsWith('"') && text.endsWith('"') && text.length > 1) {
            text = text.slice(1, -1);
        }

        // Unescape escaped quotes and newlines
        text = text.replace(/\\"/g, '"').replace(/\\n/g, '\n');

        // Clean raw JSON artifacts that might have leaked
        text = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
        if (text.trim().startsWith('{') && text.trim().endsWith('}')) {
            try {
                const parsed = JSON.parse(text);
                text = parsed.text || parsed.content || parsed.explanation || text;
            } catch (e) {
                // Not valid JSON, keep as is
            }
        }

        // Remove duplicate spaces and excessive empty lines
        text = text.replace(/ {2,}/g, ' ');
        text = text.replace(/\n{3,}/g, '\n\n');

        return text.trim();
    },

    // 3. Remove duplicate heading if it matches the block title
    removeDuplicateHeading(text, title) {
        if (!text || !title) return text;
        const cleanTitle = title.trim();
        const escapedTitle = this.escapeRegExp(cleanTitle);
        const headingRegex = new RegExp(`^(?:#+\\s+|\\*\\*|__)?${escapedTitle}(?:\\*\\*|__)?\\s*\\n+`, 'i');
        return text.replace(headingRegex, '').trim();
    },

    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },

    // 4. Parse steps from a text blob (for Worked Example)
    parseSteps(text) {
        if (!text) return { intro: '', steps: [] };
        
        // Look for "Step 1:", "1.", "Step 1 -", etc.
        const stepRegex = /(?:Step\s+\d+[:.-]|\b\d+\.)\s+/ig;
        
        // If no steps found, return empty steps array
        if (!stepRegex.test(text)) return { intro: text, steps: [] };

        // Reset regex state
        stepRegex.lastIndex = 0;
        
        let splitText = text.split(stepRegex);
        let intro = '';
        let steps = [];
        
        // The first element might be introductory text
        if (splitText[0].trim()) {
            intro = splitText[0].trim();
        }
        
        // The rest are the actual steps
        for (let i = 1; i < splitText.length; i++) {
            if (splitText[i].trim()) {
                steps.push({ number: i, text: splitText[i].trim() });
            }
        }
        
        return { intro, steps };
    },

    // 5. Parse multiple choice options securely
    parseOptions(optionsRaw) {
        if (!optionsRaw) return [];
        if (Array.isArray(optionsRaw)) {
            return optionsRaw
                .map(o => typeof o === 'string' ? o.replace(/^[A-D][.):-]\s*/i, '').trim() : String(o))
                .filter(Boolean);
        }
        if (typeof optionsRaw === 'string') {
            if (optionsRaw.includes('\n')) {
                return optionsRaw.split('\n').map(o => o.replace(/^[A-D][.):-]\s*/i, '').trim()).filter(Boolean);
            }
            if (optionsRaw.includes(',')) {
                return optionsRaw.split(',').map(o => o.trim()).filter(Boolean);
            }
        }
        return [];
    },

    // 6. Check if block has actual content
    hasContent(block) {
        if (!block) return false;
        
        const textContent = this.extractText(block.content);
        if (!textContent.trim() && !block.title) {
            // Keep media blocks even if text is empty (they will render an asset)
            const mediaTypes = ['suggested_diagram', 'suggested_video', 'image_placeholder', 'video_ref', 'suggested_image', 'suggested_illustration', 'suggested_infographic', 'repository_asset'];
            if (!mediaTypes.includes(block.block_type)) {
                return false;
            }
        }
        return true;
    }
};
