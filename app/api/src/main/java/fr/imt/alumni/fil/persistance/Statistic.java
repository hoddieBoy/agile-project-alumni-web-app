package fr.imt.alumni.fil.persistance;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class Statistic {

    private static final String URL = "jdbc:postgresql://localhost:8080/alumni_fil";
    private static final String USER = "admin";
    private static final String PASSWORD = "notForProduction";

    private Connection connect() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

    public int getTotalAlumni() {
        String sql = "SELECT COUNT(*) FROM alumni";
        try (Connection conn = connect();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {

            if (rs.next()) {
                return rs.getInt(1);
            }

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
        return 0;
    }
}