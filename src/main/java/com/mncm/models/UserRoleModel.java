package com.mncm.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.mncm.enums.EntityStatus;
import com.mncm.enums.UserRole;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Created by sonudhakar on 18/03/18.
 */
@Data
@NoArgsConstructor
public class UserRoleModel implements Serializable {

    private static final long serialVersionUID = 2030869478669707759L;

    @JsonProperty("contactId")
    private String contactId;

    @JsonProperty("role")
    private UserRole role;

    @JsonProperty("status")
    private EntityStatus status;

    public UserRoleModel(String contactId, UserRole role, EntityStatus status){
        this.contactId = contactId;
        this.role = role;
        this.status = status;
    }
}
