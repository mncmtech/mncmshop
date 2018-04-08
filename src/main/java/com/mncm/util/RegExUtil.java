package com.mncm.util;

import java.util.regex.Pattern;

public class RegExUtil {

    public static boolean isMatch(String regex, String src) {
        if (src == null || src.isEmpty())
            return false;

        try {
            return Pattern.matches(regex, src);
        } catch (Exception e) {
            return false;
        }
    }
}
