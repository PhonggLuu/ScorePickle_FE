import React, { useState, useEffect } from 'react';
import {
  Button,
  Space,
  Table,
  Tabs,
  Modal,
  Form,
  Input,
  Select,
  message,
  TableColumnsType,
} from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { BlogCategory, Rule } from '@src/modules/Category/models';
import { useGetBlogCategories } from '@src/modules/Category/hooks/useGetBlogCategories';
import { useCreateBlogCategory } from '@src/modules/Category/hooks/useCreateBlogCategory';
import { useUpdateBlogCategory } from '@src/modules/Category/hooks/useUpdateBlogCategory';
import { useDeleteBlogCategory } from '@src/modules/Category/hooks/useDeleteBlogCategory';
import { useGetAllRules } from '@src/modules/Category/hooks/useGetAllRules';
import { useCreateRule } from '@src/modules/Category/hooks/useCreateRule';
import { useUpdateRule } from '@src/modules/Category/hooks/useUpdateRule';
import { useDeleteRule } from '@src/modules/Category/hooks/useDeleteRule';

const { TabPane } = Tabs;
const { Option } = Select;

export const ContentPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isRuleModalVisible, setIsRuleModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(
    null
  );
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [ruleContent, setRuleContent] = useState<string>('');
  const [categoryForm] = Form.useForm();
  const [ruleForm] = Form.useForm();

  // Image preview modal
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');

  const { data: categoriesData, refetch: refetchCategories } =
    useGetBlogCategories(currentPage, pageSize);
  const { data: rulesData, refetch: refetchRules } = useGetAllRules(
    currentPage,
    pageSize
  );

  const { mutate: createCategory } = useCreateBlogCategory();
  const { mutate: updateCategory } = useUpdateBlogCategory();
  const { mutate: deleteCategory } = useDeleteBlogCategory();

  const { mutate: createRule } = useCreateRule();
  const { mutate: updateRule } = useUpdateRule();
  const { mutate: deleteRule } = useDeleteRule();

  // Set initial values when editing a rule
  useEffect(() => {
    if (selectedRule) {
      setRuleContent(selectedRule.content || '');
    }
  }, [selectedRule, selectedCategory]);

  const handleCategorySubmit = (values: any) => {
    if (selectedCategory) {
      updateCategory(
        { id: selectedCategory.id, name: values.name },
        {
          onSuccess: () => {
            setIsCategoryModalVisible(false);
            setSelectedCategory(null);
            categoryForm.resetFields();
            refetchRules();
          },
          onError: () => {},
        }
      );
    } else {
      createCategory(values, {
        onSuccess: () => {
          setIsCategoryModalVisible(false);
          setSelectedCategory(null);
          categoryForm.resetFields();
          refetchCategories();
        },
        onError: () => {},
      });
    }
  };

  const handleRuleSubmit = (values: any) => {
    const ruleValues = {
      ...values,
      content: ruleContent,
    };

    if (selectedRule) {
      updateRule(
        { ...ruleValues, id: selectedRule.id },
        {
          onSuccess: () => {
            setIsRuleModalVisible(false);
            setSelectedRule(null);
            setRuleContent('');
            ruleForm.resetFields();
            refetchRules();
          },
          onError: () => {},
        }
      );
    } else {
      createRule(ruleValues, {
        onSuccess: () => {
          setIsRuleModalVisible(false);
          setRuleContent('');
          ruleForm.resetFields();
          refetchRules();
        },
        onError: () => {},
      });
    }
  };

  // Preview image helper function
  const handleViewImage = (imageUrl: string) => {
    setPreviewImageUrl(imageUrl);
    setIsImageModalVisible(true);
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // Define table columns
  const categoryColumns: TableColumnsType<BlogCategory> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedCategory(record);
              setIsCategoryModalVisible(true);
              categoryForm.setFieldsValue(record);
            }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              deleteCategory(
                { blogCategoryId: record.id },
                {
                  onSuccess: () => {
                    message.success('Category deleted successfully');
                    refetchCategories();
                  },
                  onError: () => {
                    message.error('Failed to delete category');
                  },
                }
              );
            }}
          />
        </Space>
      ),
    },
  ];

  const ruleColumns: TableColumnsType<Rule> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: 'Category',
      dataIndex: 'blogCategoryId',
      key: 'blogCategoryId',
      width: 120,
      render: (blogCategoryId) => {
        const category = categoriesData?.results?.find(
          (cat: BlogCategory) => cat.id === blogCategoryId
        );
        return category ? category.name : 'Unknown';
      },
    },
    {
      title: 'Images',
      key: 'images',
      width: 150,
      render: (_, record) => (
        <Space>
          {record.image1 && (
            <img
              src={record.image1}
              alt="Image 1"
              style={{
                width: 50,
                height: 50,
                objectFit: 'cover',
                cursor: 'pointer',
              }}
              onClick={() => handleViewImage(record.image1)}
            />
          )}
          {record.image2 && (
            <img
              src={record.image2}
              alt="Image 2"
              style={{
                width: 50,
                height: 50,
                objectFit: 'cover',
                cursor: 'pointer',
              }}
              onClick={() => handleViewImage(record.image2)}
            />
          )}
        </Space>
      ),
    },
    {
      title: 'Content Preview',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (content) => (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedRule(record);
              setRuleContent(record.content || '');
              ruleForm.setFieldsValue(record);
              setIsRuleModalVisible(true);
            }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              deleteRule(
                { RuleId: record.id },
                {
                  onSuccess: () => {
                    message.success('Rule deleted successfully');
                    refetchRules();
                  },
                  onError: () => {
                    message.error('Failed to delete rule');
                  },
                }
              );
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Category" key="1">
          <Button
            type="primary"
            onClick={() => {
              setIsCategoryModalVisible(true);
              categoryForm.resetFields();
              setSelectedCategory(null);
            }}
            style={{ marginBottom: 16 }}
          >
            Add Category
          </Button>
          <Table
            columns={categoryColumns}
            dataSource={categoriesData?.results || []}
            rowKey="id"
            style={{ backgroundColor: '#ffffff' }}
            pagination={{
              current: categoriesData?.currentPage,
              total: categoriesData?.totalCount,
              pageSize: categoriesData?.pageSize,
              onChange: handlePaginationChange,
              pageSizeOptions: ['10', '20', '50'],
              showSizeChanger: true,
            }}
          />
        </TabPane>
        <TabPane tab="Content (Rule)" key="2">
          <Button
            type="primary"
            onClick={() => {
              setIsRuleModalVisible(true);
              ruleForm.resetFields();
              setSelectedRule(null);
              setRuleContent('');
            }}
            style={{ marginBottom: 16 }}
          >
            Add Rule
          </Button>
          <Table
            columns={ruleColumns}
            dataSource={rulesData?.results || []}
            rowKey="id"
            style={{ backgroundColor: '#ffffff' }}
            pagination={{
              current: rulesData?.currentPage,
              total: rulesData?.totalCount,
              pageSize: rulesData?.pageSize,
              onChange: handlePaginationChange,
              pageSizeOptions: ['10', '20', '50'],
              showSizeChanger: true,
            }}
          />
        </TabPane>
      </Tabs>

      {/* Category Modal */}
      <Modal
        title={selectedCategory ? 'Edit Category' : 'Add Category'}
        open={isCategoryModalVisible}
        onCancel={() => {
          setIsCategoryModalVisible(false);
          setSelectedCategory(null);
          categoryForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={categoryForm}
          layout="vertical"
          initialValues={selectedCategory || { name: '' }}
          onFinish={handleCategorySubmit}
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[
              { required: true, message: 'Please input the category name!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {selectedCategory ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Rule Modal with image fields */}
      <Modal
        title={selectedRule ? 'Edit Rule' : 'Add Rule'}
        open={isRuleModalVisible}
        width={800}
        onCancel={() => {
          setIsRuleModalVisible(false);
          setSelectedRule(null);
          setRuleContent('');
          ruleForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={ruleForm}
          layout="vertical"
          initialValues={
            selectedRule || {
              title: '',
              content: '',
              blogCategoryId: null,
              image1: '',
              image2: '',
            }
          }
          onFinish={handleRuleSubmit}
        >
          <Form.Item
            name="title"
            label="Rule Title"
            rules={[
              { required: true, message: 'Please input the rule title!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="blogCategoryId"
            label="Category"
            rules={[{ required: true, message: 'Please select a category!' }]}
          >
            <Select>
              {categoriesData?.results?.map((category: BlogCategory) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="content"
            label="Rule Content"
            rules={[
              { required: true, message: 'Please input the rule content!' },
            ]}
          >
            <ReactQuill value={ruleContent} onChange={setRuleContent} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {selectedRule ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        title="Image Preview"
        open={isImageModalVisible}
        onCancel={() => setIsImageModalVisible(false)}
        footer={null}
        width={800}
      >
        <div style={{ textAlign: 'center' }}>
          <img
            src={previewImageUrl}
            alt="Preview"
            style={{ maxWidth: '100%', maxHeight: '600px' }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ContentPage;
