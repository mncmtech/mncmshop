package com.mncm.models;

import com.mncm.enums.AccountType;
import com.mncm.util.ObjUtil;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.Set;

/**
 * Created by sonudhakar on 18/03/18.
 */
@Data
public class AccountModel implements Serializable{

    @JsonProperty("id")
    private String id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("type")
    private AccountType type;

    @JsonProperty("linkedContacts")
    private Set<String> linkedContacts;

}
