package com.farmxp.market.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class ConstraintChecker implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("========== CHECKING CONSTRAINTS ==========");
        try {
            List<Map<String, Object>> constraints = jdbcTemplate.queryForList(
                    "SELECT constraint_name, search_condition_vc FROM user_constraints WHERE table_name = 'MARKET_BUYER'"
            );
            for (Map<String, Object> row : constraints) {
                System.out.println(row.get("CONSTRAINT_NAME") + " -> " + row.get("SEARCH_CONDITION_VC"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("==========================================");
    }
}
