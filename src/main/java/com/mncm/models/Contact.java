package com.mncm.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mncm.enums.EntityStatus;
import com.mncm.enums.UserRole;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;
import java.util.Set;

/**
 * Created by sonudhakar on 18/03/18.
 */
@Data
public class Contact implements Serializable{

    @JsonProperty("id")
    private String id;

    @JsonProperty("accountId")
    private String accountId;

    @JsonProperty("login")
    private String login;

    @JsonProperty("password")
    private String password;

    @JsonProperty("status")
    private EntityStatus status;

    @JsonProperty("lastName")
    private String lastName;

    @JsonProperty("firstName")
    private String firstName;

    @JsonProperty("linkedContactMethods")
    private Set<String> linkedContactMethods;

    @JsonProperty("photoId")
    private String photoId;
}
