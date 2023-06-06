alter table users
    drop constraint user_role_fk;
alter table users
    drop constraint user_order_fk;
alter table addresses
    drop constraint address_user_fk;
alter table dishes
    drop constraint dish_category_fk;
alter table orders
    drop constraint order_address_fk;
alter table orders
    drop constraint order_status_fk;
alter table orders
    drop constraint order_customer_fk;
alter table orders
    drop constraint order_manager_fk;
alter table order_items
    drop constraint order_item_dish_fk;
alter table order_items
    drop constraint order_item_order_fk;
alter table reviews
    drop constraint review_user_fk;

drop table users;
drop table roles;
drop table addresses;
drop table dishes;
drop table categories;
drop table orders;
drop table statuses;
drop table order_items;
drop table reviews;

create table users
(
    id       bigint primary key generated always as identity,
    login    varchar(20)  not null unique,
    password varchar(200) not null,
    name     varchar(40)  not null,
    email    varchar(40)  null,
    phone    varchar(15)  null,
    blocked  boolean      not null default false,
    role_id  bigint       not null,
    order_id bigint       null
);

create table roles
(
    id   bigint primary key generated always as identity,
    name varchar(30) not null unique
);

create table addresses
(
    id        bigint primary key generated always as identity,
    country   varchar(30) not null,
    locality  varchar(40) not null,
    street    varchar(40) null,
    house     varchar(10) not null,
    apartment varchar(10) null,
    user_id   bigint      not null
);

create table dishes
(
    id          bigint primary key generated always as identity,
    name        varchar(40)  not null,
    description varchar(200) not null,
    image_url   varchar(100) null,
    weight      smallint     not null default (0) check (weight >= 0),
    price       money        not null default (0) check (price >= money(0)),
    discount    smallint     not null default (0) check (discount >= 0 and discount <= 100),
    category_id bigint       not null
);

create table categories
(
    id   bigint primary key generated always as identity,
    name varchar(30) not null unique
);

create table orders
(
    id             bigint primary key generated always as identity,
    price          money     not null default (0) check (price >= money(0)),
    specified_date timestamp null,
    order_date     timestamp null,
    delivery_date  timestamp null,
    address_id     bigint    null,
    status_id      bigint    not null,
    customer_id    bigint    not null,
    manager_id     bigint    null
);

create table statuses
(
    id   bigint primary key generated always as identity,
    name varchar(30) not null unique
);

create table order_items
(
    id       bigint primary key generated always as identity,
    quantity int    not null default (0) check (quantity >= 0),
    dish_id  bigint not null,
    order_id bigint not null
);

create table reviews
(
    id      bigint primary key generated always as identity,
    grade   smallint     null check (grade >= 1 and grade <= 5),
    comment varchar(200) null,
    date    timestamp    not null default current_timestamp,
    user_id bigint       not null
);

alter table users
    add constraint user_role_fk foreign key (role_id) references roles (id);
alter table users
    add constraint user_order_fk foreign key (order_id) references orders (id);

alter table addresses
    add constraint address_user_fk foreign key (user_id) references users (id);

alter table dishes
    add constraint dish_category_fk foreign key (category_id) references categories (id);

alter table orders
    add constraint order_address_fk foreign key (address_id) references addresses (id);
alter table orders
    add constraint order_status_fk foreign key (status_id) references statuses (id);
alter table orders
    add constraint order_customer_fk foreign key (customer_id) references users (id);
alter table orders
    add constraint order_manager_fk foreign key (manager_id) references users (id);

alter table order_items
    add constraint order_item_dish_fk foreign key (dish_id) references dishes (id);
alter table order_items
    add constraint order_item_order_fk foreign key (order_id) references orders (id);

alter table reviews
    add constraint review_user_fk foreign key (user_id) references users (id) on delete cascade on update cascade;