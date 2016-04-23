"""empty message

Revision ID: 30d5b74bb266
Revises: 6f4ed3a6a256
Create Date: 2016-04-23 09:19:31.776702

"""

# revision identifiers, used by Alembic.
revision = '30d5b74bb266'
down_revision = '6f4ed3a6a256'

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_foreign_key(None, 'groups_users', 'group', ['group_id'], ['id'])
    op.create_foreign_key(None, 'groups_users', 'user', ['user_id'], ['id'])
    op.create_foreign_key(None, 'post', 'user', ['user_id'], ['id'])
    op.create_foreign_key(None, 'roles_users', 'role', ['role_id'], ['id'])
    op.create_foreign_key(None, 'roles_users', 'user', ['user_id'], ['id'])
    op.create_foreign_key(None, 'user', 'group', ['own_group_id'], ['id'])
    op.drop_column('user', 'last_login')
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('last_login', mysql.DATETIME(), nullable=True))
    op.drop_constraint(None, 'user', type_='foreignkey')
    op.drop_constraint(None, 'roles_users', type_='foreignkey')
    op.drop_constraint(None, 'roles_users', type_='foreignkey')
    op.drop_constraint(None, 'post', type_='foreignkey')
    op.drop_constraint(None, 'groups_users', type_='foreignkey')
    op.drop_constraint(None, 'groups_users', type_='foreignkey')
    ### end Alembic commands ###
