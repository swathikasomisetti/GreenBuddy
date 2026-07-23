package com.greenbuddy.greenbuddy.service.ai;

public class JsonExtractor {

    private JsonExtractor() {
    }

    public static String extract(String text) {

        if (text == null)
            return "";

        text = text.trim();

        if (text.startsWith("```json")) {
            text = text.substring(7);
        }

        if (text.startsWith("```")) {
            text = text.substring(3);
        }

        if (text.endsWith("```")) {
            text = text.substring(0, text.length() - 3);
        }

        return text.trim();
    }

}