package com.mncm.models;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Unindex;
import com.mncm.enums.AccountType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Set;

/**
 * Created by sonudhakar on 18/03/18.
 */
@Data
public class Account implements Serializable {

    private static final long serialVersionUID = 8103509625951224949L;

    @JsonProperty("name")
    private String name;

    @JsonProperty("type")
    private AccountType type;

    @JsonProperty("linkedContacts")
    private Set<String> linkedContacts;

    @JsonProperty("linkedContactMethods")
    private Set<String> linkedContactMethods;

    @JsonProperty("linkedAddresses")
    private Set<String> linkedAddresses;

}
