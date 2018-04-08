package com.mncm.models;

import com.mncm.enums.AccountType;
import com.mncm.enums.UserRole;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.mncm.enums.AccountType;
import com.mncm.enums.UserRole;
import lombok.Data;

import java.io.Serializable;

/**
 * Created by sonudhakar on 25/03/18.
 */
@Data
public class LoginResponse implements Serializable{

    @JsonProperty("contact")
    private Contact contact;

    @JsonProperty("role")
    private UserRole role;

    @JsonProperty("accountType")
    private AccountType accountType;
}
