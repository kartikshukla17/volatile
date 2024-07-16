#![allow(non_snake_case)]
#![no_std]
use soroban_sdk::{contract, contracttype, contractimpl, log, Env, Symbol, String, symbol_short};


#[contracttype]
#[derive(Clone)]

pub struct ProductStatus {
    pub approved: u64,
    pub pending: u64,
    pub expired: u64,
    pub total: u64
}

const ALL_PRODUCTS: Symbol = symbol_short!("ALL_PROD");

#[contracttype] 
pub enum AdminBook { 
    AdminControl(u64)
}

#[contracttype]
#[derive(Clone)] 
pub struct AdminControl {
    pub ac_id: u64,   
    pub approval_time: u64, 
    pub approval: bool, 
}  

#[contracttype] 
pub enum ProductBook { 
    Product(u64)
}

const COUNT_PRODUCT: Symbol = symbol_short!("C_PROD"); 

#[contracttype]
#[derive(Clone)] 
pub struct Product {
    pub unique_id: u64,
    pub name: String,
    pub description: String,
    pub creation_time: u64, 
    pub expiration_time: u64,
    pub is_expired: bool,   
}  

#[contract]
pub struct ProductManagementContract;

#[contractimpl]
impl ProductManagementContract {
    
    pub fn add_product(env: Env, name: String, description: String) -> u64 {
        let mut count_product: u64 = env.storage().instance().get(&COUNT_PRODUCT).unwrap_or(0);
        count_product += 1;
        
        let mut product = Self::view_product(env.clone(), count_product.clone());   
        
        let admin_record = Self::view_admin_control_by_id(env.clone(), count_product.clone());

        if product.is_expired == true && admin_record.approval == false {
            let time = env.ledger().timestamp();
    
            let mut all_products = Self::view_all_product_status(env.clone()); 
    
            product.name = name;
            product.description = description;
            product.creation_time = time;
            product.is_expired = false;
            
            all_products.pending += 1;
            all_products.total = all_products.total + 1;

            product.unique_id = all_products.total.clone();
            
            env.storage().instance().set(&ProductBook::Product(product.unique_id.clone()), &product);
    
            env.storage().instance().set(&ALL_PRODUCTS, &all_products);
            
            env.storage().instance().set(&COUNT_PRODUCT, &count_product);

            env.storage().instance().extend_ttl(5000, 5000);

            log!(&env, "Product Added with Product-ID: {}", product.unique_id.clone());

            return product.unique_id.clone(); 
                
        } else {
            count_product -= 1;
            env.storage().instance().set(&COUNT_PRODUCT, &count_product);
            log!(&env, "You can't add a product! You already have a pending product");
            panic!("You can't add a product!");
        }
    }

    pub fn approve_product(env: Env, ac_id: u64) {
        let mut admin_record = Self::view_admin_control_by_id(env.clone(), ac_id.clone());     
        
        let product = Self::view_product(env.clone(), ac_id.clone()); 
        
        if admin_record.approval == false && ac_id.clone() <= product.unique_id.clone() {
            let time = env.ledger().timestamp(); 
            
            admin_record.ac_id = ac_id;
            admin_record.approval = true;
            admin_record.approval_time = time;

            let mut all_status = Self::view_all_product_status(env.clone()); 
            all_status.approved += 1; 
            all_status.pending -= 1;  
            
            env.storage().instance().set(&ALL_PRODUCTS, &all_status);
            
            env.storage().instance().set(&AdminBook::AdminControl(ac_id.clone()), &admin_record);
            
            env.storage().instance().extend_ttl(5000, 5000);

            log!(&env, "Product-ID: {}, is now Approved", ac_id);
        } else {
            log!(&env, "Cannot Approve!!");
            panic!("Cannot Approve!!")
        } 
    }

    pub fn expire_product(env: Env, unique_id: u64) {
        let admin_record = Self::view_admin_control_by_id(env.clone(), unique_id.clone()); 
       
        let mut product = Self::view_product(env.clone(), unique_id.clone());   

        if admin_record.approval == true && product.is_expired == false {
            let time = env.ledger().timestamp();
            
            product.is_expired = true;
            product.expiration_time = time;

            let mut all_products = Self::view_all_product_status(env.clone());
            all_products.expired += 1; 

            env.storage().instance().set(&ALL_PRODUCTS, &all_products);
            
            env.storage().instance().set(&ProductBook::Product(unique_id.clone()), &product);
            
            env.storage().instance().extend_ttl(5000, 5000);
            
            log!(&env, "Product-ID: {}, is now Expired!!", unique_id);
        } else {
            log!(&env, "Either you haven't added this product, or your product is not approved yet, or your product is already expired!!!!");
            panic!("Either you haven't added this product, or your product is not approved yet, or your product is already expired!!");
        } 
    }
    
    pub fn view_all_product_status(env: Env) -> ProductStatus {    
        env.storage().instance().get(&ALL_PRODUCTS).unwrap_or(ProductStatus {
            approved: 0,
            pending: 0,
            expired: 0,
            total: 0
        })
    }

    pub fn view_product(env: Env, uniqueid: u64) -> Product {
        let key = ProductBook::Product(uniqueid.clone()); 
        
        env.storage().instance().get(&key).unwrap_or(Product {
            unique_id: 0,
            name: String::from_str(&env, "Not_Found"),
            description: String::from_str(&env, "Not_Found"),
            creation_time: 0,
            expiration_time: 0,
            is_expired: true, 
        })
    }

    pub fn view_admin_control_by_id(env: Env, unique_id: u64) -> AdminControl {
        let ac_key = AdminBook::AdminControl(unique_id.clone()); 
        
        env.storage().instance().get(&ac_key).unwrap_or(AdminControl {
            ac_id: 0,
            approval_time: 0,
            approval: false,
        })
    }
}