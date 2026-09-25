package com.farmxp.ai;

import org.junit.jupiter.api.Test;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;

public class JacksonTest {

    private static class GeminiResponse {
        public List<Candidate> candidates;
        public static class Candidate { public Content content; }
        public static class Content { public List<Part> parts; }
        public static class Part { public String text; }
    }

    @Test
    public void test() throws Exception {
        String json = "{\"candidates\":[{\"content\":{\"parts\":[{\"text\":\"Hello\"}]}}]}";
        ObjectMapper mapper = new ObjectMapper();
        GeminiResponse r = mapper.readValue(json, GeminiResponse.class);
        System.out.println("TEST SUCCESS: " + r.candidates.get(0).content.parts.get(0).text);
    }
}
